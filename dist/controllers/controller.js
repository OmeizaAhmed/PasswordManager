export const getPasswords = (req, res) => {
    res.json({ message: "This is the all password route" });
};
export const getPassword = (req, res) => {
    const { id } = req.params;
    res.json({ message: `This is password ${id} route` });
};
export const addPassword = (req, res) => {
    res.json({ message: "Password have been added" });
};
export const deletePassword = (req, res) => {
    const { id } = req.params;
    res.json({ message: `Password with id: ${id} has been deleted` });
};
export const editPassword = (req, res) => {
    const { id } = req.params;
    res.json({ message: `Password with id: ${id} has been edited` });
};
//# sourceMappingURL=controller.js.map