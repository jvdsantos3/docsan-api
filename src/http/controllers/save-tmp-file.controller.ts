// import { BadRequestException, Controller, HttpCode, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
// import { FileInterceptor } from '@nestjs/platform-express'

// @Controller('/uploads/tmp')
// export class SaveTmpFileController {
//   @Post('/temp')
//   @HttpCode(201)
//   @UseInterceptors(
//     FileInterceptor('file', {
//       fileFilter: (req, file, cb) => {
//         if (file.mimetype === 'application/pdf') {
//           cb(null, true)
//         } else {
//           cb(
//             new BadRequestException('Apenas arquivos PDF são permitidos'),
//             false,
//           )
//         }
//       },
//       limits: { fileSize: 10 * 1024 * 1024 }, // 10mb,
//     }),
//   )
//   async handle(@UploadedFile() file: Express.Multer.File) {

//   }
// }
