const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

const TABLE_NAMES_ENUM = {
  USER: "user",
  COMPANIES: "company",
  SAVED: "userSavedCompany", // Changed to camelCase to match Prisma's naming convention
};

/**
 * Format the table name to the prisma model name
 * @param {*} tableName - name of the table
 */
function formatTableName(tableName) {
  return typeof tableName === "string" ? prisma[tableName] : prisma[tableName];
}

/**
 * Scan the table named tableName for a specific record statisfying the clauses
 * @param {*} tableName - name of the table
 * @param {*} clauses - sql clauses to filter the records
 * @returns
 */
async function scan(tableName, clauses) {
  const model = formatTableName(tableName);

  if (clauses.where) {
    if (clauses.where.id) {
      return await model.findUnique(clauses);
    }
    return await model.findFirst(clauses);
  }
  return await model.findUnique(clauses);
}

/**
 * Create a new record in the table named tableName with the creationData
 * @param {*} tableName - name of the table
 * @param {*} creationData - data to create the record with
 */
async function createRecord(tableName, creationData) {
  const model = formatTableName(tableName);
  return await model.create({ data: creationData });
}

async function deleteRecord(tableName, id) {
  const model = formatTableName(tableName);
  return model.delete({ where: { id: id } });
}

async function updateRecord(tableName, id, updateData) {
  const model = formatTableName(tableName);
  return model.update({ where: { id: id }, data: updateData });
}

/**
 * Get all records in the table named tableName
 * @param {*} tableName - name of the table
 */
async function getAll(tableName) {
  const model = formatTableName(tableName);
  return await model.findMany();
}

/**
 * Get a page of records in the table named tableName with optional filter clauses
 * @param {*} tableName - name of the table
 * @param {*} currentPageNumber - 0 based
 * @param {*} pageSize - number of records per page
 * @param {*} blockSize - number of pages to fetch at a time
 * @param {*} clauses - optional Prisma filter clauses (where, orderBy, etc.)
 * @returns
 */
async function getPages(
  tableName,
  currentPageNumber,
  pageSize,
  blockSize,
  clauses = {},
) {
  const model = formatTableName(tableName);

  const queryOptions = {
    skip: currentPageNumber * pageSize * blockSize,
    take: pageSize * blockSize,
    orderBy: { id: "asc" },
  };

  if (clauses.where) {
    queryOptions.where = clauses.where;
  }

  if (clauses.orderBy) {
    queryOptions.orderBy = clauses.orderBy;
  }

  if (clauses.include) {
    queryOptions.include = clauses.include;
  }

  return await model.findMany(queryOptions);
}

function paginate(arr, pages, PAGE_SIZE, startingPageId) {
  if (!arr || arr.length == 0) {
    return pages;
  }

  const n = arr.length;
  const j = Math.ceil(n / PAGE_SIZE);
  for (let i = 0; i < j; i++) {
    const k = i * PAGE_SIZE;
    pages.push({
      pageNumber: startingPageId + i,
      pageEntries: arr.slice(k, k + PAGE_SIZE),
    });
  }
  return pages;
}

/**
 * Get the number of records in the table named tableName
 * @param {*} tableName - name of the table
 */
async function tableCardinality(tableName) {
  const model = formatTableName(tableName);
  return await model.count();
}

/**
 * Execute a raw SQL query
 * @param {string} query - The SQL query to execute
 * @param {Array} params - Optional parameters for the query
 * @returns {Promise} - The result of the query
 */
async function executeQuery(query, params = []) {
  return await prisma.$queryRawUnsafe(query, ...params);
}

module.exports = {
  scan,
  createRecord,
  deleteRecord,
  getAll,
  getPages,
  paginate,
  tableCardinality,
  formatTableName,
  executeQuery,
  updateRecord,
  TABLE_NAMES_ENUM,
};
