"use client";

export default function AdminPage() {
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <iframe
        src="/admin-static/index.html"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
        title="Decap CMS Admin"
      />
    </div>
  );
}
