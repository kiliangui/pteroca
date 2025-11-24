export const eggs = {
    "minecraft":{
        "id":7,
        "nest":1,
        environment: {
          "VANILLA_VERSION": "latest",
          "SERVER_JARFILE": "server.jar"
        },
    },
    "bedrock":{
        "id":17,
        "nest":1,
        environment: {
            "BEDROCK_VERSION":"latest",
          "CHEATS": "false",
          "DIFFICULTY": "normal",
          "GAMEMODE":"survival",
          "SERVERNAME":"Bedrock Server",
          "LD_LIBRARY_PATH":"."
        },
        
    },
    "satisfactory":{
        "id":19,
        "nest":5,
        environment:{
            "AUTO_UPDATE":"1",
            "NUM_AUTOSAVES":"3",
            "MAX_PLAYERS":"4",
            "INIT_CONNECT_TIMEOUT":"30",
            "CONNECT_TIMEOUT":"20",
            "SRCDS_APPID":"1690800",
            "RELIABLE_PORT":"8888"
        }
    },
    "rust":{
        "id":16,
        "nest":4
    },
    "ark:se":{
        "id":8,
        "nest":2
    },
    "ark:sa":{
        "id":18,
        "nest":2
    }
}
