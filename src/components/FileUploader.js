// import React, { useState } from "react";

// const FileUploader = () => {
//   const [files, setFiles] = useState([]);

//   const handleFileChange = (event) => {
//     const selectedFiles = Array.from(event.target.files);
//     const filePreviews = selectedFiles.map((file) => {
//       return {
//         file,
//         url: URL.createObjectURL(file),
//       };
//     });
//     setFiles(filePreviews);
//   };

//   return (
//     <div style={styles.container}>
//       <h2>Upload your files</h2>
//       <input
//         type="file"
//         multiple
//         accept="application/pdf"
//         onChange={handleFileChange}
//         style={styles.input}
//       />

//       {files.length > 0 && (
//         <div style={styles.preview}>
//           <h3>PDF Previews:</h3>
//           {files.map((item, index) => (
//             <div key={index} style={styles.pdfWrapper}>
//               <p>{item.file.name}</p>
//               <iframe
//                 src={item.url}
//                 title={item.file.name}
//                 style={styles.iframe}
//               ></iframe>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// const styles = {
//   container: {
//     margin: "2rem",
//     fontFamily: "Arial",
//   },
//   input: {
//     marginBottom: "1rem",
//   },
//   preview: {
//     marginTop: "1rem",
//   },
//   pdfWrapper: {
//     marginBottom: "2rem",
//     border: "1px solid #ccc",
//     padding: "10px",
//   },
//   iframe: {
//     width: "100%",
//     height: "500px",
//     border: "none",
//   },
// };

// export default FileUploader;

import React, { useState } from "react";
import PDFViewer from "./PDFViewer";

const FileUploader = () => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    const selected = Array.from(event.target.files);
    const pdfFiles = selected
      .filter((f) => f.type === "application/pdf")
      .map((file) => ({
        name: file.name,
        file,
        url: URL.createObjectURL(file),
      }));

    setFiles(pdfFiles);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Upload your PDF files</h2>
      <input
        type="file"
        multiple
        accept="application/pdf"
        onChange={handleFileChange}
      />

      {files.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          {files.map((item, idx) => (
            <div key={idx} style={{ marginBottom: "3rem" }}>
              <h4>{item.name}</h4>
              <PDFViewer file={item.url} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
