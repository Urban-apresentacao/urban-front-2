'use client';

import styles from './table.module.css';

export function Table({ columns, data, isLoading }) {
  const skeletonRows = Array.from({ length: 5 });

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            {columns.map((col, index) => (
              <th key={index} className={styles.th}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            skeletonRows.map((_, rowIndex) => (
              <tr key={`skel-${rowIndex}`} className={styles.tr}>
                {columns.map((_, colIndex) => (
                  <td key={`skel-col-${colIndex}`} className={styles.td}>
                    <div className={styles.skeletonBar} />
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <>
              {data && data.length > 0 ? (
                data.map((row, rowIndex) => (
                  <tr key={rowIndex} className={`${styles.tr} ${styles.dataRow}`}>
                    {columns.map((col, colIndex) => (
                      <td key={colIndex} className={styles.td}>
                        {col.render ? col.render(row) : row[col.accessor]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className={styles.empty}>
                    Nenhum registro encontrado.
                  </td>
                </tr>
              )}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}