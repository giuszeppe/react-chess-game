import Board from '../components/Board'

import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

test('board is rendered ', async () => {
    render(<Board />)

    expect(screen.getByRole('div', ))
})