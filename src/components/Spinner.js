import spinner from "../assets/loading.gif"
export default function Spinner() {
  return (
    <div>
      <img src={spinner} alt="" className='img-fluid w-100' />
    </div>
  )
}
