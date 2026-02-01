import { PrismaClient, TicketStatus, TicketPriority } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const t1 = await prisma.ticket.create({
    data: {
      title: "Login page not loading on mobile",
      description:
        "When I open the app on my iPhone (Safari), the login page shows a blank white screen. This started after the last update. I've tried clearing cache and restarting the device. The desktop version works fine.",
      status: TicketStatus.OPEN,
      priority: TicketPriority.HIGH,
    },
  });

  const t2 = await prisma.ticket.create({
    data: {
      title: "Request to add dark mode",
      description:
        "It would be great to have a dark mode option in the settings. Many users work at night and the current bright theme is straining. A simple toggle in the profile or settings page would be sufficient. Low urgency but would improve accessibility.",
      status: TicketStatus.IN_PROGRESS,
      priority: TicketPriority.LOW,
    },
  });

  const t3 = await prisma.ticket.create({
    data: {
      title: "Password reset email not received",
      description:
        "I requested a password reset 3 times in the last hour but never received the email. I checked spam and promotions. My email is correct in the account. Please look into the email delivery or provide an alternative way to reset the password.",
      status: TicketStatus.RESOLVED,
      priority: TicketPriority.HIGH,
    },
  });

  await prisma.comment.createMany({
    data: [
      { ticketId: t1.id, authorName: "Support", message: "Thanks for reporting. We're checking the mobile build and will update you within 24 hours." },
      { ticketId: t1.id, authorName: "User", message: "Still happening on iOS 17. Let me know if you need any device logs." },
      { ticketId: t2.id, authorName: "Dev Team", message: "Dark mode is on our roadmap for Q2. We'll notify when it's in beta." },
      { ticketId: t3.id, authorName: "Support", message: "The issue was on our email provider side. Resend has been triggered. Please check your inbox." },
      { ticketId: t3.id, authorName: "User", message: "Received it and reset successfully. Thanks!" },
    ],
  });

  console.log("Seed completed: 3 tickets, 5 comments.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
