// testObject = {
//     chatLog: {

//     },
//     nutritionLog:
//     {
//         DATE: { food: {}, summary: {} }
//     },
//     exerciseLog:
//     {
//         DATE: { exercise: {}, summary: {} }
//     }
// }

exports.createHTML = (req, res, next) => {
    res.render("chat");
}