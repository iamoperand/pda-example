import * as anchor from '@project-serum/anchor'
import { Program } from '@project-serum/anchor'
import { PublicKey } from '@solana/web3.js'
import { expect } from 'chai'

import { Game } from '../target/types/game'

describe('game', () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace.Game as Program<Game>

  it('Sets and changes name!', async () => {
    const [userStatsPDA] = await PublicKey.findProgramAddress(
      [anchor.utils.bytes.utf8.encode('user-stats'), provider.wallet.publicKey.toBuffer()],
      program.programId,
    )

    await program.methods
      .createUserStats('iamoperand')
      .accounts({
        user: provider.wallet.publicKey,
        userStats: userStatsPDA,
      })
      .rpc()

    expect((await program.account.userStats.fetch(userStatsPDA)).name).to.equal('iamoperand')

    await program.methods
      .changeUsername('nikhil')
      .accounts({
        user: provider.wallet.publicKey,
        userStats: userStatsPDA,
      })
      .rpc()

    expect((await program.account.userStats.fetch(userStatsPDA)).name).to.equal('nikhil')
  })
})
