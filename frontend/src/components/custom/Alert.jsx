export default function Alert({ type = "error", message }) {
  const baseStyle =
    "w-full text-center text-sm rounded p-2 border"

  const styles = {
    error: "text-red-600 bg-red-50 border-red-200",
    success: "text-green-600 bg-green-50 border-green-200",
    info: "text-blue-600 bg-blue-50 border-blue-200",
  }

  return (
    <div className={`${baseStyle} ${styles[type]}`}>
      {message}
    </div>
  )
}
