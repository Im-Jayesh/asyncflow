import { PrismaClient } from "@prisma/client";
import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAILID,
    pass: process.env.APP_PASSWORD,
  },
});

async function sendEmail(to: string, message: string) {
  const res = await transporter.sendMail({
    from: 'your-email@gmail.com',
    to,
    subject: 'AsyncFlow Notification 🚀',
    text: message,
  });

  // SMTP-level validation
  if (res.rejected && res.rejected.length > 0) {
    throw new Error(`Email rejected for: ${res.rejected.join(', ')}`);
  }

  return res;
}

const prisma = new PrismaClient();

export const sendEmailProccessor = async (job) => {
    console.log("📩 Processing job...");
    console.log("Job Name:", job.name);
    console.log("Job Data:", job.data);

    const databaseId = job.data.jobId; 

    const jobData = await prisma.job.findUnique({
        where: { id: Number(databaseId) }
    });


    if (!jobData) {
        throw new Error(`Critical: DB Record ${databaseId} not found.`);
    }

    await sendEmail(jobData?.email,jobData?.message);

    await prisma.job.update({
      where: {
        id: job ? job.data.jobId : undefined,
      },
      data: {
        status: "completed",
      },
    });

    return { 
    status: 'success', 
    message: `Successfully sent to ${jobData.email}`,
    timestamp: new Date()
  };
    

  }