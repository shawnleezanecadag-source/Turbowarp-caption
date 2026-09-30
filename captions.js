class AutoCaptions {
    constructor() {
        this.recognition = null;
        this.listening = false;
        this.finalText = "";
        this.interimText = "";

        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();

            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = "en-US";

            this.recognition.onstart = () => {
                this.listening = true;
            };

            this.recognition.onend = () => {
                this.listening = false;
            };

            this.recognition.onerror = (event) => {
                console.log("Speech recognition error:", event.error);
                this.listening = false;
            };

            this.recognition.onresult = (event) => {
                let finalText = "";
                let interimText = "";

                for (
                    let i = event.resultIndex;
                    i < event.results.length;
                    i++
                ) {
                    const result = event.results[i];

                    if (result.isFinal) {
                        finalText += result[0].transcript + " ";
                    } else {
                        interimText += result[0].transcript;
                    }
                }

                this.finalText += finalText;
                this.interimText = interimText;
            };
        }
    }

    getInfo() {
        return {
            id: "autocaptions",
            name: "Auto Captions",
            color1: "#FF0000",
            color2: "#CC0000",
            color3: "#990000",

            blocks: [
                {
                    opcode: "start",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "start captions"
                },

                {
                    opcode: "stop",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "stop captions"
                },

                {
                    opcode: "clear",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "clear captions"
                },

                {
                    opcode: "caption",
                    blockType: Scratch.BlockType.REPORTER,
                    text: "current caption"
                },

                {
                    opcode: "finalCaption",
                    blockType: Scratch.BlockType.REPORTER,
                    text: "final caption"
                },

                {
                    opcode: "interimCaption",
                    blockType: Scratch.BlockType.REPORTER,
                    text: "currently speaking"
                },

                {
                    opcode: "isListening",
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: "captions listening?"
                }
            ]
        };
    }

    start() {
        if (!this.recognition) {
            return;
        }

        try {
            this.recognition.start();
        } catch (error) {
            // Already running
        }
    }

    stop() {
        if (!this.recognition) {
            return;
        }

        try {
            this.recognition.stop();
        } catch (error) {
            // Not running
        }

        this.listening = false;
    }

    clear() {
        this.finalText = "";
        this.interimText = "";
    }

    caption() {
        return (this.finalText + this.interimText).trim();
    }

    finalCaption() {
        return this.finalText.trim();
    }

    interimCaption() {
        return this.interimText.trim();
    }

    isListening() {
        return this.listening;
    }
}

Scratch.extensions.register(new AutoCaptions());