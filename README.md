Req
    - Get the content values from a web page and print out values



Low Level Design 
    common.js
        VibeMap
            name
            set of key words 
            defacult Music name
            override Music name 
                By default wiil be null 
                User can set it from UI 
        MusicMap
            name
            url 
        DomainMap 
            domainMusicEnabled
                by default true
            domainUrl 
            music name
    
    background.js
        onStartUp 
            create ofscreen document 
        onTabActivation
            Check if url present in DomainMap 
                if url is present in DomainMap
                    if domainMusicEnabled is enabled
                        play the DoaminMap music
                    else
                        No music
                else
                    Get vibe from content.js
                    Play the VibeMap music 
    
    content.js
        OnMessage
            get the URL text
            Using the VibeMap find the VibeMap
            Return the Vibe 

    UI 
        DomainMap UI 
            Enable Domain Music
            DropDown of all music 
            Return values - Music Name and Domain URL 
                This should be updated in domainMusic
