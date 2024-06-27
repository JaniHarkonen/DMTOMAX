import imgWarning from "../../assets/exclamation-triangle-icon.svg";

export default function OutputPathWarning(props) {
  const hide = props.hide;
  if( hide )
  return <><p></p></>;

  return (
    <div className="d-flex d-align-items-center">
      <img
        className="warning-icon"
        src={imgWarning}
        alt=""
      />
      Warning! Output directory doesn't exist.
    </div>
  );
}