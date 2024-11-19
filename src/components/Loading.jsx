import { ClipLoader } from "react-spinners";

function Loading({loading}) {
  return (
    <div id="loading-container">
    <ClipLoader
      size={100}
      color={"#e35108f2"}
      loading={loading}
      cssOverride={{
        display: "block",
        marginTop: "200px",
        borderWidth: "5px",
      }}
    />
  </div>
  )
}

export default Loading