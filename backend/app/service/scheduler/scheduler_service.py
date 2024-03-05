import sched
from apscheduler.schedulers.background import BackgroundScheduler

sched = BackgroundScheduler(timezone="Asia/Seoul")


class SchedulerService(object):
    _instance = None

    def __new__(class_, *args, **kwargs):
        if not isinstance(class_._instance, class_):
            class_._instance = object.__new__(class_, *args, **kwargs)

        return class_._instance

    # 매일 새벽 1시 30분에 작동
    # @sched.scheduled_job('cron', hour='1', minute='30', id='remove_inactive_image')

    def start(self):
        sched.start()

    # @sched.scheduled_job("cron", second="*/1")
    # def test():
    #     print("hey")

    # # 2시간마다
    @sched.scheduled_job("cron", hour="*/2")
    def scheduled_job_every_two_hours():
        print("This job runs every two hours.")

    # # 4시간마다
    # @repeat_at(cron="0 */4 * * *")
    # async def fourHoursScheduler():
    #     print("hey")

    # 24시간마다, 즉 매일 실행되는 작업
    @sched.scheduled_job("cron", hour=0)
    def scheduled_job_every_day():
        print("This job runs every day at midnight.")
