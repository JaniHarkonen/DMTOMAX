const ipcRenderer = window.require("electron").ipcRenderer;

export const DEFAULT_CONFIGURATION_SCHEMA = {
  "mappings": {
    "spine_JNT": "Chest",
    "spine1_JNT": "Chest2",
    "Chest": "Chest3",

    "LeftUpArm": "LeftShoulder",
    "LeftLowArm": "LeftElbow",
  
    "l_handThumb1_JNT": "LeftFinger0",
    "l_handThumb2_JNT": "LeftFinger01",
    "l_handThumb3_JNT": "LeftFinger02",
  
    "l_handIndex1_JNT": "LeftFinger1",
    "l_handIndex2_JNT": "LeftFinger11",
    "l_handIndex3_JNT": "LeftFinger12",
    
    "l_handMiddle1_JNT": "LeftFinger2",
    "l_handMiddle2_JNT": "LeftFinger21",
    "l_handMiddle3_JNT": "LeftFinger22",
    
    "l_handRing1_JNT": "LeftFinger3",
    "l_handRing2_JNT": "LeftFinger31",
    "l_handRing3_JNT": "LeftFinger32",
    
    "l_handPinky1_JNT": "LeftFinger4",
    "l_handPinky2_JNT": "LeftFinger41",
    "l_handPinky3_JNT": "LeftFinger42",
    
    "RightUpArm": "RightShoulder",
    "RightLowArm": "RightElbow",
    
    "r_handThumb1_JNT": "RightFinger0",
    "r_handThumb2_JNT": "RightFinger01",
    "r_handThumb3_JNT": "RightFinger02",
    
    "r_handIndex1_JNT": "RightFinger1",
    "r_handIndex2_JNT": "RightFinger11",
    "r_handIndex3_JNT": "RightFinger12",
    
    "r_handMiddle1_JNT": "RightFinger2",
    "r_handMiddle2_JNT": "RightFinger21",
    "r_handMiddle3_JNT": "RightFinger22",
    
    "r_handRing1_JNT": "RightFinger3",
    "r_handRing2_JNT": "RightFinger31",
    "r_handRing3_JNT": "RightFinger32",
    
    "r_handPinky1_JNT": "RightFinger4",
    "r_handPinky2_JNT": "RightFinger41",
    "r_handPinky3_JNT": "RightFinger42",
    
    "LeftUpLeg": "LeftHip",
    "LeftLowLeg": "LeftKnee",
    "LeftFoot": "LeftAnkle",
    "l_toebase_JNT": "LeftToe",
    
    "RightUpLeg": "RightHip",
    "RightLowLeg": "RightKnee",
    "RightFoot": "RightAnkle",
    "r_toebase_JNT": "RightToe"
  }
};

export class Config {
  constructor(configurationPath) {
    this.subscribers = {};
    this.configuration = null;
    this.configurationPath = configurationPath;
    this.skipFileUpdates = false;
  }

  loadConfig(callback) {
    const readJsonAfterEnsure = () => {
      ipcRenderer.invoke(
        "read-json", this.configurationPath
      ).then((json) => callback(JSON.parse(json)));
    };

    ipcRenderer.invoke(
      "ensure-json-exists", 
      this.configurationPath, 
      DEFAULT_CONFIGURATION_SCHEMA
    ).then(readJsonAfterEnsure, readJsonAfterEnsure);
  }

  setConfig(configJson) {
    this.configuration = configJson;
  }

  subscribe(id, callback) {
    this.subscribers[id] = callback;

    if( this.configuration === null ) {
      this.configuration = DEFAULT_CONFIGURATION_SCHEMA;
      this.loadConfig((json) => {
        this.stopFileUpdates(true);
        this.update(json);
        this.stopFileUpdates(false);
      });
    }
    else
    callback({ configuration: this.configuration });
  }

  unsubscribe(id) {
    delete this.subscribers[id];
  }

  update(newConfig) {
    this.configuration = newConfig;
    this.updateFile();
    this.notifySubscribers();
  }

  updateMappings(mappings) {
    this.update({
      ...this.configuration,
      mappings
    });
  }

  notifySubscribers() {
    for( let id of Object.keys(this.subscribers) ) {
      this.subscribers[id]({
        configuration: this.configuration
      });
    }
  }

  updateFile() {
    if( this.skipFileUpdates === true )
    return;

    ipcRenderer.invoke("write-json", this.configurationPath, this.configuration);
  }

  stopFileUpdates(skipFlag) {
    this.skipFileUpdates = skipFlag;
  }
}
