function outputPrimitive = fitPrimitive(primitive, points)
%   Args:
% 		primitive: P x 10 array, primitive[p, :] = [c1, c2, c3, c4, c5, c6,
%               c7, c8, c9, c10] where:
%                   c1 is the primitive type:
%                       0: plane; 1: sphere; 2: cylinder; 3: cone; 4: torus
%                   c2 is the number of points belong to this primitive
%                   c3 - c10 are primitive's parameters
%                       for plane:
%                           [c3, c4, c5]: a point on plane
%                           [c6, c7, c8]: the plane's normal
%                       for sphere:
%                           [c3, c4, c5]: the sphere's center
%                           c6: the sphere's radius
%                       for cylinder:
%                           [c3, c4, c5]: the cylinder axis's direction
%                           [c6, c7, c8]: a point on the cylinder's axis
%                           c9: the cylinder's radius
%                       for cone:
%                           [c3, c4, c5]: the cone's apex
%                           [c6, c7, c8]: the cone axis's direction
%                           c9: the cone opening angle (in radians)
%                       for torus:
%                           [c3, c4, c5]: the torus axis's direction
%                           [c6, c7, c8]: the torus's center
%                           c9: the torus's major radius
%                           c10: the torus's minor radius
% 		point: N x 3 array for N points
% 	Returns:
% 		outputPrimitive: similar format with primitive

    outputPrimitive = primitive;
    if (primitive(1) == 0)
        [outputPrimitive(3), outputPrimitive(4), outputPrimitive(5), outputPrimitive(6), outputPrimitive(7), outputPrimitive(8)] = fitPlane(points, primitive(3), primitive(4), primitive(5), primitive(6), primitive(7), primitive(8));
    elseif (primitive(1) == 1)
        [outputPrimitive(3), outputPrimitive(4), outputPrimitive(5), outputPrimitive(6)] = fitSphere(points, primitive(3), primitive(4), primitive(5), primitive(6));
    elseif (primitive(1) == 2)
        [outputPrimitive(3), outputPrimitive(4), outputPrimitive(5), outputPrimitive(6), outputPrimitive(7), outputPrimitive(8), outputPrimitive(9)] = fitCylinder(points, primitive(3), primitive(4), primitive(5), primitive(6), primitive(7), primitive(8), primitive(9));
    elseif (primitive(1) == 3)
        [outputPrimitive(6), outputPrimitive(7), outputPrimitive(8), outputPrimitive(3), outputPrimitive(4), outputPrimitive(5), outputPrimitive(9)] = fitCone(points, primitive(6), primitive(7), primitive(8), primitive(3), primitive(4), primitive(5), primitive(9));
    elseif (primitive(1) == 4)
        [outputPrimitive(3), outputPrimitive(4), outputPrimitive(5), outputPrimitive(6), outputPrimitive(7), outputPrimitive(8), outputPrimitive(9), outputPrimitive(10)] = fitTorus(points, primitive(3), primitive(4), primitive(5), primitive(6), primitive(7), primitive(8), primitive(9), primitive(10));
    end
end
