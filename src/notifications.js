import { LocalNotifications } from "@capacitor/local-notifications";

export async function setupNotifications() {
  try {
    const permission = await LocalNotifications.requestPermissions();

    if (permission.display !== "granted") {
      console.log("Notification permission not granted");
      return false;
    }

    await LocalNotifications.createChannel({
      id: "focusgo",
      name: "FocusGo",
      description: "FocusGo reminders and study notifications",
      importance: 4,
      visibility: 1
    });

    return true;
  } catch (error) {
    console.error("Notification setup failed:", error);
    return false;
  }
}
