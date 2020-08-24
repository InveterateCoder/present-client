import React from 'react'
import { Link } from 'react-router-dom'

export function Paginator(props) {
  function getBefore() {
    let ret = []
    if (props.page === 1) return
    let current = props.page - 1
    if (props.total - props.page < 4) {
      for (; current > props.total - 4 && current > 0; current--) {
        ret.push(<li className="page-item" key={current}><Link className="page-link" to={`/book/${current + props.search}`}>{current}</Link></li>)
      }
    }
    if (current > 0) {
      ret.push(<li className="page-item" key={current}><Link className="page-link" to={`/book/${current + props.search}`}>{current}</Link></li>)
      --current
    }
    if (current - 1 > 1) {
      ret.push(<li className="page-item" key={current - 1}><Link className="page-link" to={`/book/${current - 1 + props.search}`}>...</Link></li>)
      ret.push(<li className="page-item" key={1}><Link className="page-link" to={"/book/1" + props.search}>1</Link></li>)
    } else {
      for (; current > 0; current--) {
        ret.push(<li className="page-item" key={current}><Link className="page-link" to={`/book/${current + props.search}`}>{current}</Link></li>)
      }
    }
    return ret.reverse()
  }
  function getAfter() {
    let ret = []
    if (props.page >= props.total) return
    let current = props.page + 1
    ret.push(<li className="page-item" key={current}><Link className="page-link" to={`/book/${current + props.search}`}>{current}</Link></li>)
    current++
    if (current < 6 && current < props.total) {
      for (; current < 6 && current <= props.total; current++) {
        ret.push(<li className="page-item" key={current}><Link className="page-link" to={`/book/${current + props.search}`}>{current}</Link></li>)
      }
    }
    if (current + 1 < props.total) {
      ret.push(<li className="page-item" key={current + 1}><Link className="page-link" to={`/book/${current + 1 + props.search}`}>...</Link></li>)
      ret.push(<li className="page-item" key={props.total}><Link className="page-link" to={`/book/${props.total + props.search}`}>{props.total}</Link></li>)
    } else {
      for (; current <= props.total; current++) {
        ret.push(<li className="page-item" key={current}><Link className="page-link" to={`/book/${current + props.search}`}>{current}</Link></li>)
      }
    }
    return ret
  }
  if (props.total < 2 || props.page > props.total) return null
  return <ul className="pagination pagination-sm justify-content-center mt-4">
    {getBefore()}
    <li className="page-item active" key={props.page}><Link className="page-link" to={`/book/${props.page + props.search}`}>{props.page}</Link></li>
    {getAfter()}
  </ul>
}