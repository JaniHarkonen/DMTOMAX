export function JointMapping(joint, replacement) {
  return {
    joint,
    replacement
  };
}

export const DEFAULT_CONFIGURATION_SCHEMA = {
  "mappings": [
    JointMapping("Hip", "Hip"),
    JointMapping("spine_JNT", "Chest"),
    JointMapping("spine1_JNT", "Chest2"),
    JointMapping("Chest", "Chest3"),
    JointMapping("Neck", "Neck"),
    JointMapping("Head", "Head"),

    JointMapping("LeftCollar", "LeftCollar"),
    JointMapping("LeftUpArm", "LeftShoulder"),
    JointMapping("LeftLowArm", "LeftElbow"),
    JointMapping("LeftHand", "LeftHand"),
  
    JointMapping("l_handThumb1_JNT", "LeftFinger0"),
    JointMapping("l_handThumb2_JNT", "LeftFinger01"),
    JointMapping("l_handThumb3_JNT", "LeftFinger02"),
  
    JointMapping("l_handIndex1_JNT", "LeftFinger1"),
    JointMapping("l_handIndex2_JNT", "LeftFinger11"),
    JointMapping("l_handIndex3_JNT", "LeftFinger12"),
    
    JointMapping("l_handMiddle1_JNT", "LeftFinger2"),
    JointMapping("l_handMiddle2_JNT", "LeftFinger21"),
    JointMapping("l_handMiddle3_JNT", "LeftFinger22"),
    
    JointMapping("l_handRing1_JNT", "LeftFinger3"),
    JointMapping("l_handRing2_JNT", "LeftFinger31"),
    JointMapping("l_handRing3_JNT", "LeftFinger32"),
    
    JointMapping("l_handPinky1_JNT", "LeftFinger4"),
    JointMapping("l_handPinky2_JNT", "LeftFinger41"),
    JointMapping("l_handPinky3_JNT", "LeftFinger42"),
    
    JointMapping("RightCollar", "RightCollar"),
    JointMapping("RightUpArm", "RightShoulder"),
    JointMapping("RightLowArm", "RightElbow"),
    JointMapping("RightHand", "RightHand"),
    
    JointMapping("r_handThumb1_JNT", "RightFinger0"),
    JointMapping("r_handThumb2_JNT", "RightFinger01"),
    JointMapping("r_handThumb3_JNT", "RightFinger02"),
    
    JointMapping("r_handIndex1_JNT", "RightFinger1"),
    JointMapping("r_handIndex2_JNT", "RightFinger11"),
    JointMapping("r_handIndex3_JNT", "RightFinger12"),
    
    JointMapping("r_handMiddle1_JNT", "RightFinger2"),
    JointMapping("r_handMiddle2_JNT", "RightFinger21"),
    JointMapping("r_handMiddle3_JNT", "RightFinger22"),
    
    JointMapping("r_handRing1_JNT", "RightFinger3"),
    JointMapping("r_handRing2_JNT", "RightFinger31"),
    JointMapping("r_handRing3_JNT", "RightFinger32"),
    
    JointMapping("r_handPinky1_JNT", "RightFinger4"),
    JointMapping("r_handPinky2_JNT", "RightFinger41"),
    JointMapping("r_handPinky3_JNT", "RightFinger42"),
    
    JointMapping("LeftUpLeg", "LeftHip"),
    JointMapping("LeftLowLeg", "LeftKnee"),
    JointMapping("LeftFoot", "LeftAnkle"),
    JointMapping("l_toebase_JNT", "LeftToe"),
    
    JointMapping("RightUpLeg", "RightHip"),
    JointMapping("RightLowLeg", "RightKnee"),
    JointMapping("RightFoot", "RightAnkle"),
    JointMapping("r_toebase_JNT", "RightToe"),
  ]
};

export class Config {
  constructor(ipcRenderer, configurationPath) {
    this.ipcRenderer = ipcRenderer;
    this.subscribers = {};
    this.configuration = null;
    this.configurationPath = configurationPath;
    this.skipFileUpdates = false;
    this.unsavedConfiguration = {};
  }

  loadConfig(callback) {
    const readJsonAfterEnsure = () => {
      this.ipcRenderer.invoke(
        "read-json", this.configurationPath
      ).then((json) => callback(JSON.parse(json)));
    };

    this.ipcRenderer.invoke(
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

    this.ipcRenderer.invoke("write-json", this.configurationPath, this.configuration);
  }

  stopFileUpdates(skipFlag) {
    this.skipFileUpdates = skipFlag;
  }

  store(key, value) {
    this.unsavedConfiguration[key] = value;
  }

  getStored(key, defaultValue = undefined) {
    return this.unsavedConfiguration[key] || defaultValue;
  }
}
