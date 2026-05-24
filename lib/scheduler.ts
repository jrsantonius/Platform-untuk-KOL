import cron from "node-cron";
import { ACCOUNTS } from "./accounts";
import { format } from "date-fns";

let schedulerStarted = false;

export function startScheduler(baseUrl: string) {
  if (schedulerStarted) return;
  schedulerStarted = true;

  // Run every day at 00:00 WIB (UTC+7 = 17:00 UTC previous day)
  cron.schedule("0 17 * * *", async () => {
    const date = format(new Date(), "yyyy-MM-dd");
    console.log(`[Scheduler] Starting daily content generation for ${date}`);

    for (const account of ACCOUNTS) {
      try {
        await fetch(`${baseUrl}/api/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accountId: account.id, date }),
        });
        console.log(`[Scheduler] Generated content for ${account.id}`);
      } catch (err) {
        console.error(`[Scheduler] Failed for ${account.id}:`, err);
      }
    }

    console.log(`[Scheduler] Daily generation complete for ${date}`);
  });

  console.log("[Scheduler] Daily content scheduler started (00:00 WIB)");
}
