import React from "react";

function SubDetails({ subDetails }) {

  const HeadingTag = `${subDetails.heading}`

  return (
    <React.Fragment>
      <HeadingTag className="font-bold font-20 mt-2 text-brown">{subDetails.title}</HeadingTag>
      {subDetails.question && <h3 className="font-bold font-17 mt-2 text-brown">{subDetails.question}</h3>}
      {subDetails.image && (<img src={subDetails.image} className="img-fluid my-3"></img>)}
      {subDetails.paragraph && subDetails.paragraph.map((subParagraghDetails, index) => {
        return <p key={index} className="font-regular font-16 text-brown">{subParagraghDetails}</p>;
      })
      }
      {subDetails.table && (
        <table className="table">
          <thead>
            <tr>
              {subDetails.table.headers.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {subDetails.table.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
    </React.Fragment>
  );
}

export default SubDetails;
