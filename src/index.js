import { app, port } from "./app.js";

app.listen(port, () => {
  console.log(`Server running at PORT ${port}`);
});
