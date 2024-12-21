import jwt from "jsonwebtoken";

export const should_be_logged_in = (req, res) => {
    // console.log(req.userId);
    res.status(200).json({ message: "You are authenticated" });
};

export const should_be_admin = (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Not Authenticated!" });

    jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
        if (err) return res.status(403).json({ error: "Invalid token!" });
        if (!payload.isAdmin) return res.status(403).json({ error: "Not Authorized!" });
    });

    res.status(200).json({ message: "You are authenticated" });
};
