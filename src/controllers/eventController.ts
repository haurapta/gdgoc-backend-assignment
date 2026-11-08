import { Response } from 'express';
import prisma from '../services/prisma';
import { AuthRequest } from '../middlewares/authMiddleware';

// 1. Membuat Event Baru
export const createEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, date, quota } = req.body;
    
    const newEvent = await prisma.event.create({
      data: { 
        title, 
        description, 
        date: new Date(date), 
        quota 
      }
    });

    res.status(201).json({ status: 'success', message: 'Event berhasil dibuat', data: newEvent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Gagal membuat event' });
  }
};

// 2. Mendaftar Event (Mengatasi Race Condition dengan Prisma Transaction)
export const registerEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { event_id } = req.body;
    const user_id = req.user?.id;

    if (!user_id) {
      res.status(401).json({ status: 'error', message: 'Akses ditolak' });
      return;
    }

    // Interactive Transaction: Memastikan semua proses berjalan berurutan dan aman
    const result = await prisma.$transaction(async (tx) => {
      // a. Cek event dan kuota
      const event = await tx.event.findUnique({ where: { id: event_id } });
      if (!event) throw new Error('Event tidak ditemukan');
      if (event.quota <= 0) throw new Error('Mohon maaf, kuota event sudah penuh');

      // b. Cek apakah user sudah mendaftar (Mencegah double check-in / Idempotensi)
      const existingAttendance = await tx.attendance.findUnique({
        where: { event_id_user_id: { event_id, user_id } }
      });
      if (existingAttendance) throw new Error('Anda sudah terdaftar di event ini');

      // c. Kurangi kuota secara atomik
      await tx.event.update({
        where: { id: event_id },
        data: { quota: { decrement: 1 } }
      });

      // d. Catat kehadiran
      const attendance = await tx.attendance.create({
        data: { event_id, user_id }
      });

      // e. Catat ke Audit Log (Syarat Soal)
      await tx.auditLog.create({
        data: { action: 'REGISTER_EVENT', performed_by: user_id, target_id: event_id }
      });

      return attendance;
    });

    res.status(200).json({ 
      status: 'success', 
      message: 'Berhasil mendaftar event',
      data: result
    });
  } catch (error: any) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};
