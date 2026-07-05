
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

#print(samples[50000:50020])   # peek at the first 20 raw sample values
##print("shape1", samples.shape) 

# Normalize to -1.0 to 1.0 range
if dType == np.uint8:
    samples = (samples.astype(np.float32) - 128) / 128.0
else:
    samples = samples.astype(np.float32) / np.iinfo(dType).max

# If stereo, interleaved samples need to be split and averaged
if noOfChannels == 2:
    samples = samples.reshape(-1, 2)   # split into [L, R] pairs
    samples = samples.mean(axis=1)      # average to mono

#print(samples[50000:50020])   # now in float, -1.0 to 1.0 range
#print("shape", samples.shape)  # should now be half the raw length if it was stereo

fftSize = 8096
start = 200000
window = samples[start:start + fftSize]    # just grab the first chunk to test


bassPerSecond = []
midPerSecond    = []
treblePerSecond = []

samples_per_second = frameRate

seconds = len(samples) // samples_per_second
avg_per_second = []

for i in range(seconds):
    chunk = samples[i * samples_per_second : (i + 1) * samples_per_second]
    value = float(np.mean(chunk))
    value = round(value, 5)
    avg_per_second.append(np.mean(chunk))

print(avg_per_second)

for i in range(seconds):
    chunk = samples[i * samples_per_second : (i + 1) * samples_per_second]

    fftSize = len(chunk)
    fftResult = np.fft.rfft(chunk)
    magnitude = np.abs(fftResult)
    freqs = np.fft.rfftfreq(fftSize, d=1/frameRate)

    bass   = magnitude[(freqs >= 20)   & (freqs < 250)].mean()
    mid    = magnitude[(freqs >= 250)  & (freqs < 4000)].mean()
    treble = magnitude[(freqs >= 4000) & (freqs < 20000)].mean()  

    bassPerSecond.append(round(float(bass), 5))
    midPerSecond.append(round(float(mid), 5))
    treblePerSecond.append(round(float(treble), 5))

print("Bass Per Second: ", bassPerSecond)
print("Mid Per Second: ", midPerSecond)
print("Treble Per Second: ", treblePerSecond)

