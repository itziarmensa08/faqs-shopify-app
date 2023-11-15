import db from "../db.server";

export async function getFAQ(id) {
  return db.FAQ.findUnique({
    where: { id },
  });
}

export async function getAllFAQs(shop) {
  return db.FAQ.findMany({
    where: { shop },
  });
}

export async function createFAQ(data) {
  return db.FAQ.create({
    data,
  });
}

export async function createAnswer(data) {
  return db.answer.create({
    data,
  });
}

