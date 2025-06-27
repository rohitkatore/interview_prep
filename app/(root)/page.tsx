import InterviewCard from '@/components/InterviewCard'
import { Button } from '@/components/ui/button'
import { getCurrentUser} from '@/lib/actions/auth.action'
import { getInterviewsByUserId, getLatestInterviews } from '@/lib/general.action'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

async function page() {
  const user = await getCurrentUser();
  const [userInterviews,latestInterviews] = await Promise.all([
    await getInterviewsByUserId(user?.id!),
    await getLatestInterviews({userId:user?.id!,limit:10})
  ])
  const hasPastInterviews = userInterviews.length > 0;
  const hasUpcomingInterviws = latestInterviews.length >0 ;
  return (
    <>
      <section className='card-cta'>
        <div className='flex flex-col gap-6 max-w-lg'>
          <h2>Get Interview-Ready with AI-Powered Practice and Feedback</h2>
          <p className='text-lg'>Practice on real interview questions and get feedback</p>
          <Button asChild className='btn-primary max-sm:w-full'>
            <Link href={"/interview"} >Start an Interview</Link>
          </Button>
        </div>
        <Image src={"/robot.png"} alt='robo' width={400} height={400} className='max-sm:hidden' />
      </section>
      <section className='flex flex-col mt-8 gap-6'>
        <h2>Your Interviews</h2>
        <div className="interviews-section">
          {hasPastInterviews ? (
            userInterviews?.map((interview) => (
              <InterviewCard {...interview} key={interview.id} />
            ))
          ) : (
            <p>You Haven't taken any interview.</p>
          )}
        </div>
      </section>
      <section className='flex flex-col mt-8 gap-6'>
        <h2>Take an Interview</h2>
        <div className="interviews-section">
          {hasUpcomingInterviws ? (
            latestInterviews?.map((interview) => (
              <InterviewCard {...interview} key={interview.id} />
            ))
          ) : (
            <p>There are no new interviews are available.</p>
          )}
        </div>
      </section>
    </>
  )
}

export default page
