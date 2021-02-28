import express from 'express';

import { list, count, deleteRow } from './db.js';

export const router = express.Router();

/**
 * Higher-order fall sem umlykur async middleware með villumeðhöndlun.
 *
 * @param {function} fn Middleware sem grípa á villur fyrir
 * @returns {function} Middleware með villumeðhöndlun
 */
function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

async function admin(req, res) {
  const errors = [];

  let { offset = 0, limit = 50 } = req.query;
  offset = Number(offset);
  limit = Number(limit);

  const registrations = await list(offset, limit);
  const nrofreg = await count();

  res.render('admin', {
    errors, registrations, offset, limit, nrofreg,
  });
}

async function erase(req, res) {
  if (!req.isAuthenticated()) {
    return res.redirect('/admin/login');
  }
  const {
    id,
  } = req.body;

  let success = true;
  try {
    success = await deleteRow({ nationalId: id });
  } catch (e) {
    console.error(e);
  }
  if (success) {
    return res.redirect('/admin');
  }
  return res.render('error', {
    title: 'Villa við að eyða',
    text: '',
  });
}

router.get('/', catchErrors(admin));
router.post('/delete', catchErrors(erase), catchErrors(admin));
