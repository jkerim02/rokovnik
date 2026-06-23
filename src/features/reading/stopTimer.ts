/** stopTimer — zaustavi aktivni tajmer i upiši sesiju (source: 'timer'). */
import { sessionsRepo } from '@/db/repositories';
import { useTimerStore } from '@/state/timerStore';

export async function stopActiveTimer(): Promise<void> {
  const active = useTimerStore.getState().active;
  const result = useTimerStore.getState().stop();
  if (!active || !result) return;
  await sessionsRepo.createSession({
    bookId: active.bookId,
    source: 'timer',
    startTime: result.startTime,
    endTime: result.endTime,
    durationMinutes: result.durationMinutes,
  });
}
