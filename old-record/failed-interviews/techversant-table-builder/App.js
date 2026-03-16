import React from 'react';
import './style.css';

import data from './dummy.json';

const DATA = data;

export default function App() {
  console.log(data);

  const [dataTable, setDataTable] = React.useState(data);
  const header = Object.keys(data[0]);
  const [visible, setVisble] = React.useState(header);

  // table header

  const TableHeader = () => {
    return (
      <tr>
        {visible.map((key) => (
          <th key={key}>{key}</th>
        ))}
        <th>actions</th>
      </tr>
    );
  };

  //table body
  const TableBody = ({child, index}) => {
    console.log(child['e'], visible);
    return (
      <tr>
        {visible.map((key) => (
          <td key={key}>{child[key]}</td>
        ))}
        <button
          onClick={() => {
            setDataTable((prev) => prev.filter((_, i) => i !== index));
          }}
        >
          Delete
        </button>
      </tr>
    );
  };

  return (
    <div>
      <h1>Create a Table builder!</h1>
      <p>
        Table should be build from the JSON provided in the file
        <b> src/dummy.json</b>
      </p>
      User should be able to <b>delete</b> a row and<b> hide/view</b> a column.
      The table should be dynamic and column Name should be 'key' in the json.
      eg: this table will contain the columns:
      <b> name, job, eid, age, place, country.</b>
      <p>
        <b>
          Note: Json can have any key value pairs, we don't hardcode the keys{' '}
        </b>
      </p>
      <ul>
        <li>
          {' '}
          The UI should contain a list of the columns and user should be able to
          toggle it to either show/hide.
        </li>
        <li>
          A table which is populated as per the result of the show/hide
          configuration.
        </li>
      </ul>
      {header.map((col) => (
        <label key={col}>
          <input
            type="checkbox"
            checked={visible.includes(col)}
            onChange={() =>
              setVisble(
                visible.includes(col)
                  ? visible.filter((c) => c !== col)
                  : [...visible, col]
              )
            }
          />
          {col}
        </label>
      ))}
      <table>
        <TableHeader />
        <tbody>
          {dataTable.map((item, index) => {
            return (
              <>
                <TableBody child={item} index={index} />
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
