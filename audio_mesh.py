
import wave
import numpy as np

waveValue = wave.open("/Users/ishankramnath/Desktop/Sound to Mesh/Imagine Dragons - Believer.wav", mode = "rb")

noOfChannels = waveValue.getnchannels()
frameRate = waveValue.getframerate()
sampleWidth = waveValue.getsampwidth()
noOfFrames = waveValue.getnframes()
rawBytes = waveValue.readframes(noOfFrames)

waveValue.close()

print(noOfChannels, frameRate, sampleWidth, noOfFrames)

dTypeMap = {1: np.uint8, 2: np.int16, 4: np.int32}
dType = dTypeMap[sampleWidth]

samples = np.frombuffer(rawBytes, dtype=dType)

print(samples[50000:50020])   # peek at the first 20 raw sample values
print("shape1", samples.shape) 

# Normalize to -1.0 to 1.0 range
if dType == np.uint8:
    samples = (samples.astype(np.float32) - 128) / 128.0
else:
    samples = samples.astype(np.float32) / np.iinfo(dType).max

# If stereo, interleaved samples need to be split and averaged
if noOfChannels == 2:
    samples = samples.reshape(-1, 2)   # split into [L, R] pairs
    samples = samples.mean(axis=1)      # average to mono

print(samples[50000:50020])   # now in float, -1.0 to 1.0 range
print("shape", samples.shape)  # should now be half the raw length if it was stereo

fftSize = 8096
start = 200000
window = samples[start:start + fftSize]    # just grab the first chunk to test

fftResult = np.fft.rfft(window)
magnitude = np.abs(fftResult)
freqs = np.fft.rfftfreq(fftSize, d=1/frameRate)

print(freqs[:10])       # frequency values for first few bins
print(magnitude[:10])   # magnitude/energy at those frequencies

bass   = magnitude[(freqs >= 20)   & (freqs < 250)].mean()
mid    = magnitude[(freqs >= 250)  & (freqs < 4000)].mean()
treble = magnitude[(freqs >= 4000) & (freqs < 20000)].mean()

print(f"Bass: {bass:.4f}  Mid: {mid:.4f}  Treble: {treble:.4f}")
