
import { OnlineUser, Message } from '../types';

/**
 * SocialService handles real-time synchronization between users.
 * In this implementation, we use BroadcastChannel to simulate a multi-user 
 * environment across tabs. For a real cross-device app, replace this with 
 * Supabase or Firebase logic.
 */
class SocialService {
  private channel: BroadcastChannel;
  private onMessageReceived: (msg: Message) => void = () => {};
  private onUserUpdate: (users: OnlineUser[]) => void = () => {};
  
  private users: Map<string, OnlineUser> = new Map();
  private currentUser: OnlineUser | null = null;

  constructor() {
    this.channel = new BroadcastChannel('vibeconnect_global_sync');
    this.channel.onmessage = (event) => {
      const { type, payload } = event.data;
      
      switch (type) {
        case 'USER_JOINED':
        case 'USER_HEARTBEAT':
          this.handleUserHeartbeat(payload);
          break;
        case 'CHAT_MESSAGE':
          this.onMessageReceived(payload);
          break;
        case 'USER_LEFT':
          this.users.delete(payload.id);
          this.notifyUsers();
          break;
      }
    };

    // Clean up stale users every 10 seconds
    setInterval(() => this.cleanupUsers(), 10000);
  }

  private handleUserHeartbeat(user: OnlineUser) {
    this.users.set(user.id, { ...user, lastSeen: Date.now() });
    this.notifyUsers();
  }

  private cleanupUsers() {
    const now = Date.now();
    let changed = false;
    this.users.forEach((user, id) => {
      if (now - user.lastSeen > 15000) {
        this.users.delete(id);
        changed = true;
      }
    });
    if (changed) this.notifyUsers();
  }

  private notifyUsers() {
    this.onUserUpdate(Array.from(this.users.values()));
  }

  // --- Public API ---

  init(user: OnlineUser, onMessage: (msg: Message) => void, onUsers: (users: OnlineUser[]) => void) {
    this.currentUser = user;
    this.onMessageReceived = onMessage;
    this.onUserUpdate = onUsers;
    this.broadcast('USER_JOINED', user);
    
    // Send heartbeat
    setInterval(() => {
      if (this.currentUser) this.broadcast('USER_HEARTBEAT', this.currentUser);
    }, 5000);
  }

  updateRoom(roomId: number | null) {
    if (this.currentUser) {
      this.currentUser.currentRoomId = roomId;
      this.broadcast('USER_HEARTBEAT', this.currentUser);
    }
  }

  sendMessage(msg: Message) {
    this.broadcast('CHAT_MESSAGE', msg);
  }

  private broadcast(type: string, payload: any) {
    this.channel.postMessage({ type, payload });
  }

  getUsersInRoom(roomId: number): OnlineUser[] {
    return Array.from(this.users.values()).filter(u => u.currentRoomId === roomId);
  }

  getAllOnline(): OnlineUser[] {
    return Array.from(this.users.values());
  }
}

export const socialService = new SocialService();
