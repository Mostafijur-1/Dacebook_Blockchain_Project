const Display = () => {
  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-bold">Uploaded Files</h2>
      {/* For now, we will display some placeholder content */}
      <ul className="mt-4">
        <li className="text-gray-300">File 1: example1.pdf</li>
        <li className="text-gray-300">File 2: example2.png</li>
      </ul>
    </div>
  );
};

export default Display;
