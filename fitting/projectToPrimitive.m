function [projection, projetedNormals] = projectToPrimitive(primitive, points)
    if (primitive(1) == 0)
        [projection, projetedNormals] = projectToPlane(primitive, points);
    elseif (primitive(1) == 1)
        [projection, projetedNormals] = projectToSphere(primitive, points);
    elseif (primitive(1) == 2)
        [projection, projetedNormals] = projectToCylinder(primitive, points);
    elseif (primitive(1) == 3)
        [projection, projetedNormals] = projectToCone(primitive, points);
    elseif (primitive(1) == 4)
        [projection, projetedNormals] = projectToTorus(primitive, points);
    end
end
