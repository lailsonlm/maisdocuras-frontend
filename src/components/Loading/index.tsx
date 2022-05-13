import { ImSpinner8 } from "react-icons/im";

export function Loading() {
  return (
    <div className="w-6 h-6 items-center justify-center flex overflow-hidden">
      <ImSpinner8 className="w-4 h-4 animate-spin" />
    </div>
  )
}