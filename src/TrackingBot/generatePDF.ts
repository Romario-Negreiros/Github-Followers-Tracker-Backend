import PDFDocument from 'pdfkit'
import fs from 'fs'
import { Follower } from './types/GithubAPIResponses'

const generatePDF = (userName: string, follows: Follower[], unfollows: Follower[]) => {
  const doc = new PDFDocument({ size: 'A4' })
  doc.font('Helvetica')

  doc
    .fontSize(30)
    .text('Github followers tracker', {
      align: 'center'
    })
    .moveDown()

  doc.fontSize(25).text('Daily report', { align: 'center' }).moveDown()

  doc.fontSize(18).text('Follows', { underline: true }).moveDown()

  if (follows.length) {
    follows.forEach(follow => {
      doc
        .fontSize(14)
        .fillColor('black')
        .text(
          `> ${follow.login} - (${
            follow.isYouFollowing ? 'You are following this profile' : 'You are not following this profile'
          })`
        )
        .moveDown(0)
      if (follow.isYouFollowing) {
        doc.fontSize(12).fillColor('blue').text('VISIT PROFILE TO FOLLOW', {
          link: follow.html_url,
          underline: true
        })
      }
      doc.moveDown()
    })
  } else {
    doc.fontSize(14).text('No follows today!')
  }

  doc.moveDown()
  doc.fontSize(18).fillColor('black').text('Unfollows', { underline: true }).moveDown()

  if (unfollows.length) {
    unfollows.forEach(unfollow => {
      doc
        .fontSize(14)
        .fillColor('black')
        .text(
          `> ${unfollow.login} - (${
            unfollow.isYouFollowing ? 'You are following this profile' : 'You are not following this profile'
          })`
        )
        .moveDown(0)
      if (unfollow.isYouFollowing) {
        doc.fontSize(12).fillColor('blue').text('VISIT PROFILE TO UNFOLLOW', {
          link: unfollow.html_url,
          underline: true
        })
      }
      doc.moveDown()
    })
  } else {
    doc.fontSize(14).text('No unfollows today!')
  }

  doc.pipe(fs.createWriteStream(`${userName}-report.pdf`))
  doc.end()
}

export default generatePDF
