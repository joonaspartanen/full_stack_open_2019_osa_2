import React from 'react'

const Header = ({ course }) => <h2>{course.name}</h2>

const Content = ({ course }) => course.parts.map(part => <Part key={part.id} part={part} />)

const Part = ({ part }) => <p key={part.id}>{part.name} {part.exercises} tehtävää</p>

const Total = ({ course }) => {

    const total = course.parts.reduce(function (sum, part) {
        return sum + part.exercises
    }, 0)

    return (
        <p>
            yhteensä {total} tehtävää
        </p>
    )
}

const Course = ({ course }) => {

    return (
        <>
            <Header course={course} />
            <Content course={course} />
            <Total course={course} />
        </>
    )
}

export default Course    