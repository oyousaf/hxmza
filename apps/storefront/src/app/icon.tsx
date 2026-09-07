import { ImageResponse } from "next/og"

export const size = { width: 64, height: 64 }
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#292524",
          borderRadius: 14,
          color: "#f5f5f4",
          fontSize: 38,
          fontWeight: 600,
          fontFamily: "Georgia, serif",
        }}
      >
        B
      </div>
    ),
    size
  )
}
