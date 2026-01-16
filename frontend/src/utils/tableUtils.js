import tableApi from "../api/tableApi";

export const getTableNameById = async (tableId) => {
  if (!tableId) return "";

  const table = await tableApi.getTableById(tableId);

  return table?.tableName || "";
};
