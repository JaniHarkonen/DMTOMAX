import ConvertTab from "../layouts/ConvertTab/ConvertTab";
import MappingsTab from "../layouts/MappingsTab/MappingsTab";

export const AppTab = (tabKey, tabCaption, TabElement) => {
  return {
    key: tabKey,
    caption: tabCaption,
    TabElement: TabElement
  };
};

export const DMTOMAXTabs = [
  AppTab("convert", "Convert files", ConvertTab),
  AppTab("mappings", "Define mappings", MappingsTab)
];
