import { useState } from "react";

export default function OrbitInjectionForm({ onStart }) {
  const [form, setForm] = useState({
    px: 0, py: 0, pz: 5,
    vx: 0, vy: 0.1, vz: 0,
    thrust: 100,
    isp: 300,
    fuel: 500,
    targetAltitude: 700,
    inclination: 51.6,
    eccentricity: 0.001
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: parseFloat(value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onStart(form);
  };

  return (
    <div className="fixed left-0 top-0 w-80 h-full bg-gray-900 text-white p-4 overflow-y-auto shadow-lg z-10">
      <h2 className="text-xl font-bold mb-4">Orbit Injection</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        {["px", "py", "pz", "vx", "vy", "vz", "thrust", "isp", "fuel", "targetAltitude", "inclination", "eccentricity"].map((key) => (
          <div key={key}>
            <label className="block text-sm">{key}</label>
            <input
              type="number"
              step="any"
              name={key}
              value={form[key]}
              onChange={handleChange}
              className="w-full px-2 py-1 rounded bg-gray-800 text-white"
            />
          </div>
        ))}
        <button type="submit" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 mt-2">Start Injection</button>
      </form>
    </div>
  );
}
