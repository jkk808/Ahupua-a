import { Suspense, lazy } from 'react';
import LLMComponent from 'src/components/LLM/LLM';

const LLMPage = () => {
  return (
    <div className='@container'>
      <Suspense fallback={<div>Loading LLM interface...</div>}>
        <LLMComponent />
      </Suspense>
    </div>
  )
}

export default LLMPage
