
var binary = function() {
    var pad = function(n, width) {
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
    }
    var ops=["&", "|", "^"];
    var num1=Math.floor(Math.random()*255);
    var num2=Math.floor(Math.random()*255);
    var bin1 = pad(num1.toString(2),8);
    var bin2 = pad(num2.toString(2),8);
    var op = Math.floor(Math.random()*3);
    while (op==3)
        op = Math.floor(Math.random()*3);
    var res = eval (num1.toString() + " " + ops[op]+" "+num2.toString());
    return {
            "chall": bin1 + " " + ops[op] + "\n" + bin2,
            "res": res
            }
}

var hex = function() {
    return {
            "chall":"hex",
            "res": 1
        }
}

exports.challenges =  {
    "binary": {
                "rules":"Give me the result with B <result> as a binary",
                "description": "Solve a binary operation between two numbers",
                "def": "B",
                "delay":3000,
                "chall": binary,
                "num_sol": 1,
                "solver": function(s, res) {
                    var x = parseInt(s[0], 2);
                    if (!isNaN(x))
                        if (x === res)
                            return true;
                    return false;
                }
},
    "hex": {
                "rules":"Give me the result with H <result> as a number",
                "description": "Convert a number from hex to decimal form",
                "def": "H",
                "delay":10000,
                "chall": hex,
                "num_sol": 1,
                "solver": function(s, res) {
                    if (s[0] == '1')
                        return true;
                    else
                        return false;
                }
        }
}
