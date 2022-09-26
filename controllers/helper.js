let helper = {

    toPersianNumber: function(num, comma) {
        let map = {
            "1": "۱",
            "2": "۲",
            "3": "۳",
            "4": "۴",
            "5": "۵",
            "6": "۶",
            "7": "۷",
            "8": "۸",
            "9": "۹",
            "0": "۰",
            "-": "-"
        }
        let chars = num.toString().split("");
        let numz = "";
        let last = chars.length - 1;
        for (let z = chars.length - 1; z >= 0; z--) {
            if (map[chars[z]]) {
                numz = map[chars[z]] + numz;
            } else {
                numz = chars[z] + numz;
            }
            if (comma) {
                if ((z > 0) && ((last - z) % 3 == 2)) {
                    numz = "‌,‌" + numz;
                }
            }

            // console.log(numz);
        }
        return numz;
    },
    toEnNumber(num) {
        let map = {
            "۱": "1",
            "۲": "2",
            "۳": "3",
            "۴": "4",
            "۵": "5",
            "۶": "6",
            "۷": "7",
            "۸": "8",
            "۹": "9",
            "۰": "0",
            "-": "-",
            "1": "1",
            "2": "2",
            "3": "3",
            "4": "4",
            "5": "5",
            "6": "6",
            "7": "7",
            "8": "8",
            "9": "9",
            "-": "-",
            "-": "-",
            "0": "0",
        };
        let chars = num.toString().split("");
        let numz = "";
        let last = chars.length - 1;
        for (let z = chars.length - 1; z >= 0; z--) {
            if (map[chars[z]]) {
                numz = map[chars[z]] + numz;
            } else {

            }

        }
        return numz;
    },
    getBookFrontCover: function(front_cover, token, size) {
        if (front_cover && typeof front_cover === "object") {
            return front_cover[size];
        } else {
            if (!!front_cover && (["medium", "medium_rounded", "medium_trans", "large", "thumbnail"].indexOf(size) > -1)) {
                // debugger;

                return front_cover.split("/books/")[0] + "/files/styles/" + size + "/books/" + ((front_cover.split("/books/")[1]) ? front_cover.split("/books/")[1].split("/")[0] : "") + "/" + front_cover.split("/")[front_cover.split("/").length - 1];
            } else
                return "/storage/files/styles/" + size + "/" + "anonymous.jpg";
        }
    },
    urlify: function(string) {
        if (string) {
            // replace persian numbers with en for reason;
            try {
                return string.split(" ").join("-")
                    .split("‌").join("-") // nim fasele
                    .split("‌/").join("-")
                    .split("‌\\").join("-")
                    .split(" ").join("-")

                .split("*").join("")
                    .split("/").join("")
                    .split("<").join("")
                    .split(":").join("")
                    .split(":").join("")
                    .split(">").join("")
                    .split("!").join("")
                    .split("?").join("")
                    .split("'").join("")
                    .split('"').join("")
                    .split("\"").join("")
                    .split(",").join("")
                    .split("#").join("")
                    .split("$").join("")
                    .split("^").join("")
                    .split("(").join("")
                    .split(")").join("")
                    .split("‌").join("")
                    .split(";").join("")
                    .split("]").join("")
                    .split("[").join("")
                    .split("}").join("")
                    .split("{").join("")
                    .split("=").join("")
                    .split("%").join("")

            } catch (e) {
                return string.split(" ").join("-").split("‌").join("");
            }
        } else {
            return "";
        }
    },

}
module.exports = helper;