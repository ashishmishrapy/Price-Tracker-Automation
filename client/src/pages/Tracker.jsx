import { useState } from "react";
import Input from "../components/Input";
import History from "../components/History";

const Tracker = () => {
  const [refresh, setRefresh] = useState(false)
  return (
    <div className="min-h-screen border-2 rounded-xl p-5">
      <Input refresh={refresh} setRefresh={setRefresh} />
      <History refresh={refresh} />
    </div>
  );
};

export default Tracker;
