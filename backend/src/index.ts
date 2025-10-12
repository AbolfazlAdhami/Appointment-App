import expres from "express";

const PORT = process.env.PORT || 8000;
const app = expres();

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
