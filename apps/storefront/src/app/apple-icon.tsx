import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
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
          color: "#f5f5f4",
          fontSize: 104,
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
