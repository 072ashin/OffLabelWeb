function readPrimitive(uuid)
	workPath = '/opt/lampp/htdocs/OffLabelWeb/fitting/';
	parametersPath = strcat(uuid,'parameters.txt');
	centroidsPath = strcat(uuid,'centroids.txt');
	resultPath =  strcat(workPath, uuid, 'resultFit.txt');
	A = load(parametersPath);
	points = load(centroidsPath);
	primitive(2) = size(points,1);
	switch A(8)
		% plane
		case 0
		primitive(1) = 0;
		primitive(3:5) = A(1:3);
		primitive(6:8) = A(4:6);
		% cylinder
		case 1
		primitive(1) = 2;
		primitive(3:5) = A(4:6);
		primitive(6:8) = A(1:3);
		primitive(9) = A(7);
		% cone
		case 2
		primitive(1) = 3;
		primitive(3:5) = A(4:6);
		primitive(6:8) = A(1:3);
		primitive(9) = A(7);
		% sphere
		case 3
		primitive(1) = 1;
		primitive(3:5) = A(1:3);
		primitive(6) = A(7);
		otherwise
		return;
	end
	outputPrimitive = fitPrimitive(primitive, points);
	fid = fopen(resultPath, 'wt');
	for i = 1:size(outputPrimitive, 1)
	    fprintf(fid, '%f\n', outputPrimitive(i,:));
	end
	fclose(fid);
	exit;
end

