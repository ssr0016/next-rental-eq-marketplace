
function Spinner({ parentHeight = "100vh" }: { parentHeight?: string }) {
  return (
    <div
      style={{
        height: parentHeight !== "100vh" ? `${parentHeight}px` : parentHeight,
        width: "100%"
      }}
      className="flex justify-center items-center"
    >
      <div className="border-8 h-10 w-10 border-primary border-t-gray-300 rounded-full animate-spin"></div>
    </div>
  )
}

export default Spinner