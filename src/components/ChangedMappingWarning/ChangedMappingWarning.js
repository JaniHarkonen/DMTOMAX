import imgWarning from "../../assets/exclamation-triangle-icon.svg";

export default function ChangedMappingWarning(props) {
  const hide = props.hide;
  if( hide )
  return <></>;
  
  return (
    <div>
      <img
        className="warning-icon"
        src={imgWarning}
      />
      Unsaved changes!
    </div>
  );
}
