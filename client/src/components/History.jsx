import axios from "axios";
import React, { useEffect, useState } from "react";

const History = ({ refresh }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/history");
        setHistory(res.data.data);
        // console.log(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchHistory();
  }, [refresh]);

  return (
    <section className="p-5 overflow-x-auto mt-52">
      {/* Header */}
      <h3 className="text-xl font-semibold mb-4 border-b pb-2">
        Tracking History
      </h3>

      {/* Table */}
      <table className="w-full border border-collapse">
        <thead>
          <tr>
            <th className="border px-3 py-2 text-left">Tracked At</th>
            <th className="border px-3 py-2 text-left">Title</th>
            <th className="border px-3 py-2 text-left">Yesterday price</th>
            <th className="border px-3 py-2 text-left">Toady price</th>
            <th className="border px-3 py-2 text-left">Price Change</th>
            <th className="border px-3 py-2 text-left">Availability</th>
          </tr>
        </thead>

        <tbody>
          {history.length === 0 ? (
            <tr>
              <td colSpan="4" className="border px-3 py-4 text-center">
                No tracking history available
              </td>
            </tr>
          ) : (
            history.map((item) => (
              <tr key={item._id}>
                <td className="border px-3 py-2">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
                <td className="border px-3 py-2">{item.title}</td>
                <td className="border px-3 py-2">{item.yesterdayPrice ?? "-"}</td>
                <td className="border px-3 py-2">Rs.{item.price}</td>
                <td className={`border border-black ${item.priceChange <=0 ? "text-red-700" : "text-green-700"} px-3 py-2`}>{item.priceChange?? "-"}</td>
                <td
                  className={`${
                    item.availability.toLowerCase().includes("in stock")
                      ? "text-green-700"
                      : "text-red-700"
                  } border border-black px-3 py-2`}
                >
                  {item.availability}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
};

export default History;
